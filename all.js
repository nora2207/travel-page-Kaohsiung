const jsonUrl = 'https://api.kcg.gov.tw/api/service/Get/9c8e1450-e833-499c-8320-29b36b7ace5c';

const app = Vue.createApp({
  data() {
    return {
      jsonData: {},
      displayData: [],
      currentPage: 1,
      perPage: 0, 
      hasPage: false,
      hasNext: false,
      minData: 0,
      maxData: 0,
      pageTotal: 0,
      dataTotal: 0,
    };
  },
  methods: {
    getData() {
      fetch(jsonUrl, {method: 'get'})
        .then((response) => {
          return response.json();
        }).then((data) => {
          this.jsonData = data.data.XML_Head.Infos.Info;
          this.pagination(this.jsonData,1);
      });
    },
    pagination(data, nowPage){
      this.displayData = [];
      this.dataTotal = data.length;
      this.perPage = 20;
      this.pageTotal = Math.ceil(this.dataTotal / this.perPage);
      this.currentPage = nowPage;
      if (this.currentPage > this.pageTotal) {
        this.currentPage = this.pageTotal;
      }
      this.minData = (this.currentPage * this.perPage) - this.perPage + 1;
      this.maxData = this.currentPage * this.perPage;
      this.hasPage = this.currentPage > 1 ? true: false;
      this.hasNext = this.currentPage < this.pageTotal ? true: false;
      data.forEach((item, index) => { 
        const num = index + 1;
        if ( num >= this.minData && num <= this.maxData) {
          this.displayData.push(item);
        }
      });
    },
    changePage(pageNum) {
      this.currentPage = pageNum;
      this.pagination(this.jsonData,this.currentPage)
    },
  },
  created() {
    this.getData();
  }
});

app.component("card", {
  props:["point"],
  template:`
    <div class="col-md-6 py-2" v-for="(item,key) in point" :key="'point' + key">
      <div class="card">
        <div class="card bg-dark text-white text-left">
          <img class="card-img-top img-cover" height="155" :src="item.Picture1">
          <div class="card-img-overlay d-flex justify-content-between align-items-end p-0 px-3" style="background-color: rgba(0, 0, 0, .2)">
            <h5 class="card-img-title-lg">{{item.Name}}</h5><h5 class="card-img-title-sm">{{item.Zone}}</h5>
          </div>
        </div>
        <div class="card-body text-left">
            <p class="card-text"><i class="far fa-clock fa-clock-time"></i>&nbsp;{{item.Opentime}}</p>
            <p class="card-text"><i class="fas fa-map-marker-alt fa-map-gps"></i>&nbsp;{{item.Add}}</p>
            <p class="card-text"><i class="fas fa-mobile-alt fa-mobile"></i>&nbsp;{{item.Tel}}</p>
            <div v-if="item.Ticketinfo">
            <p class="card-text"><i class="fas fa-tags text-warning"></i>&nbsp;{{item.Ticketinfo}}</p>
            </div>
        </div>
      </div>
    </div>`
});

app.component('pageBtn', {
  props: ['currentPage', 'pageTotal', 'hasPage', 'hasNext'],
  emits: ['switchPage'],
  methods: {
    switchPage(pageNum) {
      this.$emit('switchPage', pageNum);
    }
  },
  template:`
    <li class="page-item" :class="{'disabled':hasPage == false}">
    <a class="page-link" href="#" @click="switchPage(currentPage - 1)">Previous</a></li>
    <li class="page-item" v-for="num in pageTotal" :class="{'active':currentPage == num}">
    <a class="page-link" href="#" @click="switchPage(num)">{{ num }}</a></li>
    <li class="page-item" :class="{'disabled':hasNext == false}">
    <a class="page-link" href="#" @click="switchPage(currentPage + 1)">Next</a></li>`
  
});

app.mount('#app')
