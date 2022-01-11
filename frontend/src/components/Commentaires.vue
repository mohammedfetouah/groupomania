<template>
  <div>
    <form @submit.prevent="onCreateCommentaire">

      <div class="commentaires">
        <div class="commentaire" v-for="(commentaire, index) in commentaires" :key="commentaire.id">
          <div class="delete-commentaire" v-if="isAdmin" @click="deleteCommentaire(commentaire.id,index)">
            <button type="button" class="btn-close" aria-label="delete"></button>
          </div>
          <div class="toast-header commentaire-header">
            <img src="" class="rounded me-2" alt="">
            <strong class="me-auto">{{ commentaire.user.pseudo }}</strong>
            <small>{{ formatDate(commentaire.createdAt) }}</small>
          </div>
          <div class="toast-body commentaire-message"  v-if="commentaire.message">
            {{ commentaire.message }}
          </div> 
        </div>
      </div>
        <div class="form-group"  >
        <label :for="'commentaire'+postId">Commenter</label>
        <textarea
          class="form-control"
          v-model="commentaire"
          placeholder="Ajouter un commentaire..."
          :id="'commentaire'+postId"
          onclick="this.value ='';"
        >La signature est limitée à 200 caractères</textarea>
      </div>

        <button type="submit" class="btn btn-secondary" id="button-commentaire">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89.471-1.178-1.178.471L5.93 9.363l.338.215a.5.5 0 0 1 .154.154l.215.338 7.494-7.494Z"/>
          </svg>
          Envoyer
        </button>

    </form>
  </div>
</template>

<script>
import { } from 'vuex'
import moment from 'moment'


export default {
  name: 'Commentaires',
  mounted: function() {
    if(this.$store.state.user.userId == -1) {
        this.$router.push('/connexion');
        return;
    }
    var self = this;
    var instance = this.$store.state.axios;
    instance.get('/post/' + this.postId + '/commentaires',{
        params: {
            userId: this.$store.state.user.userId
        },
        headers: {
            Authorization: 'Bearer ' + this.$store.state.user.token,
        }
    }).then(function (response) {
        self.commentaires = response.data;
        
    })
    .catch(function (error) {
        // Gèrer l'erreur
        console.log(error);
    });
  },
  props: {
    postId: Number
  },
   data : function () {
    return {
      commentaire: '',
      commentaires: [],
      createdAt: '',
      pseudo : '',
      isAdmin : this.$store.state.user.role == 'admin'
    };
  },
  components: {
  },
  methods: {
      formatDate: function (value) {
        return moment(String(value)).format('DD/MM/YYYY H:mm')
      },
      onCreateCommentaire() {
         var self = this;
        var instance = this.$store.state.axios;
        instance.post(
          '/commentaire',
          {
           commentaire: this.commentaire,
           userId: this.$store.state.user.userId,
           postId: this.postId,

          },
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
          var commentaire = response.data;
          // Ici l'api retoune le commentaire sans le user donc on l'ajoute manuellement pour afficher le pseudo
          commentaire.user = {
            pseudo: self.$store.state.user.pseudo
          };
          self.commentaires.unshift(commentaire);
        })
        .catch ((erreur) => {
          console.log(erreur)
        })
      },
      deleteCommentaire: function (commentaireId,index) {
        var self = this;
        var instance = this.$store.state.axios;
        instance.delete(
          '/commentaire/' + commentaireId,
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
          self.commentaires.splice(index, 1);
        })
        .catch ((erreur) => {
          console.log(erreur)
        });
      },
      clearCommentaire : function () {
        if (document.getElementById("signature").value == "")
        {
            document.getElementById("signature").value += "La signature est limitee a 200 caracteres";
        }
      },

  }
}
</script>


<style scoped lang="scss">
  .toast-body {
      text-align: left;
  }
  textarea.form-control {
    width: 90%;
  }
  .commentaire {
    background: #ffd7d7;
    width: 80%;
    margin: 15px auto;
    border-radius: 10px;
    .toast-header{
      background: none;
    }    
}
  .delete-commentaire {
      text-align: right;
      button.btn-close {
        margin: 5px 5px 0px 0px;
      }
  }

</style>
