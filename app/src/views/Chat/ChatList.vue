<template>
  <v-card>
    <v-card-title>
      Meus chats
      <v-spacer />
    </v-card-title>
  </v-card>
</template>

<script>
// import { listByUserEmail } from '@/services/donation';
// import { formatDateTime } from '@/utils/formatters';
// import { conditions } from '@/constants/donation';

export default {
  name: 'ChatListView',
  // data() {
  //   return {
  //     singleSelect: false,
  //     selected: [],
  //     search: '',
  //     headers: [
  //       { text: 'Comida', value: 'foodName' },
  //       { text: 'Condição', value: 'condition' },
  //       { text: 'Criação', value: 'createdAt' },
  //       { text: 'Última Atualização', value: 'updatedAt' },
  //     ],
  //     list: [],
  //     isLoading: {
  //       list: false,
  //     },
  //     showErrorSnackbar: false,
  //   };
  // },
  // mounted() {
  //   this.getDonationList();
  // },
  // methods: {
  //   formatDateTime,
  //   async getDonationList() {
  //     this.list = [];

  //     if (this.isLoading.list) return;

  //     this.isLoading.list = true;
  //     try {
  //       const { donations } = await listByUserEmail();
  //       this.list = donations;
  //     } catch (error) {
  //       this.showErrorSnackbar = true;
  //     } finally {
  //       this.isLoading.list = false;
  //     }
  //   },
  //   getConditionLabel(condition) {
  //     return conditions[condition].label || '';
  //   },
  //   getConditionColor(condition) {
  //     return conditions[condition].color || '';
  //   },
  // },
};
</script>
