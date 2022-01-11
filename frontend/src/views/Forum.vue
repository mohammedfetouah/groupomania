<template>
  <div>
    <h1>Partager votre publication</h1>
    <form @submit.prevent="onCreatePost" class="align-self-center formul" enctype="multipart/form-data">
      <div class="form-group">
        <div>
          <label for="message">Description</label>
          <textarea
            class="form-control post"
            name="message"
            id="message"
            v-model="message"
            placeholder="Commencer un post" 
          ></textarea>
        </div>
        <div class="form-image">
          <div v-if="image">
            <img :src="image" />
          </div>
        </div>
      </div>
      <div class="row-submit">
          <div v-if="!image">
            <label for="file" title="Choisir un image">
              <span class="hidden">choisir une image</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-card-image" viewBox="0 0 16 16">
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12v.54A.505.505 0 0 1 1 12.5v-9a.5.5 0 0 1 .5-.5h13z"/>
              </svg>
            </label>
            <input type="file" @change="onFileChange" name="file" id="file" accept="image/*" />
          </div>
          <div v-if="image">
            <button @click="removeImage" class="btn btn-danger">Supprimer l'image</button>
          </div>
          <div>
            <button type="submit" class="btn btn-secondary">Créer un post</button>
          </div>
      </div>
    </form>
    <div class="card post formul" v-for="(post, index) in posts" :key="post.id" >
      <div class="card-body">
        <div class="delete-post" v-if="isAdmin" @click="deletePost(post.id,index)">
          <button type="button" class="btn-close" aria-label="delete"></button>
        </div>
        <h2 class="card-title">{{ post.user.pseudo }}</h2>
        <img :src="post.img" class="card-img-bottom" :alt="'image du post '+post.id" v-if="post.img">
        <p class="card-text text-post" v-if="post.message">{{ post.message }}</p>
        <p class="card-text"><small class="text-muted">{{ formatDate(post.createdAt) }}</small></p>
      </div>
      <Commentaires :postId="post.id" />
    </div>  
  </div>
</template>

<script>
import { } from 'vuex'
import moment from 'moment'
import Commentaires from '@/components/Commentaires.vue'
import FormData from 'form-data'

export default {
  components: { Commentaires },
    name : 'Forum',
    mounted: function() {
        if(this.$store.state.user.userId == -1) {
            this.$router.push('/connexion');
            return;
        }
        var self = this;
        var instance = this.$store.state.axios;
        instance.get('/post',{
            params: {
                userId: this.$store.state.user.userId
            },
            headers: {
               'Content-Type': 'multipart/form-data',
                Authorization: 'Bearer ' + this.$store.state.user.token,
            }
        }).then(function (response) {
          console.log(response.data)
            self.posts = response.data;
            
        })
        .catch(function (error) {
            // Gèrer l'erreur
            console.log(error);
        });
    },
    data : function () {
      return {
        message: '',
        image: '',
        file: '',
        posts: [],
        createdAt: '',
        pseudo : '',
        isAdmin : this.$store.state.user.role == 'admin'
      };
    },
    computed: {
    },
    methods: {
      onCreatePost() {
        var self = this;
        var instance = this.$store.state.axios;
        let data = new FormData();
        data.append('image', this.file);
        data.append('message',this.message);
        data.append('userId',this.$store.state.user.userId);
        instance.post(
          '/post',
          data,
          {
            params: {
                userId: this.$store.state.user.userId
            },
            headers: {
                Authorization: 'Bearer ' + this.$store.state.user.token,
            }
          }
        )
        .then((response) => {
          var post = response.data;

          // Ici l'api retoune le post sans le user donc on l'ajoute manuellement pour afficher le pseudo

          post.user = {
            pseudo: self.$store.state.user.pseudo
          };
          self.posts.unshift(post);
          self.image = '';
          self.file = '';
        })
        .catch ((erreur) => {
          console.log(erreur)
        })
      },
      onFileChange(e) {
        var files = e.target.files || e.dataTransfer.files;
        if (!files.length)
          return;
        this.createImage(files[0]);
        this.file = files[0];
      },
      createImage(file) {
        var reader = new FileReader();
        var self = this;
        reader.onload = (e) => {
          self.image = e.target.result;
        };
        reader.readAsDataURL(file);
      },
      removeImage: function () {
        this.image = '';
        this.file = null;
      },
      formatDate: function (value) {
        return moment(String(value)).format('DD/MM/YYYY H:mm')
      },
      deletePost: function (postId,index) {
        var self = this;
        var instance = this.$store.state.axios;
        instance.delete(
          '/post/' + postId,
          {
            params: {
                userId: this.$store.state.user.userId
            },
            headers: {
                Authorization: 'Bearer ' + this.$store.state.user.token,
            }
          }
        )
        .then(() => {
          self.posts.splice(index, 1);
        })
        .catch ((erreur) => {
          console.log(erreur)
        });
      }
    }
  }

</script>
<style scoped lang="scss">
.row {
  margin-top: 25px;
}
.card.post {
    margin-top: 50px;
    padding-bottom: 25px;
    border-radius: 15px;
}
  textarea.form-control {
    width: 100%;
  }
  .form-image img {
    max-width: 400px;
    margin: 15px auto 0 auto;
  }
  .row-submit {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    align-items: center;
  }
  .row-submit > div {
    margin: 0 10px;
  }
  .row-submit button.btn {
    margin-top: 0;
  }
  input[type="file"] {
    display: none;
  }
  label[for="file"] {
      margin: 15px auto;
      border-radius: 50%;
      background: rgb(0, 0, 0);
      color: #fff;
      width: 35px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
  }
  label[for="file"] svg {
      height: 25px;
      width: 25px;
  }
  .delete-post {
    text-align: right;
  }
  p.card-text.text-post {
    background: #ffd7d7;
    border-radius: 15px;
    padding: 10px;
    margin-top: 15px;
}
label {
    font-weight: bold;
    margin-top: 50px;
}
</style>
