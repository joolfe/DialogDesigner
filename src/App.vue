<template>
<div>
  <el-row>
    <el-col :span="24">
      <el-header height="70px">
        <h1>Chatbot Designer</h1>
      </el-header>
    </el-col>
  </el-row>
  <el-row :gutter="20">
    <el-col :span="3">
      &nbsp;
      <!-- el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">  
        <el-submenu index="1">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>Navigator One</span>
          </template>
          <el-menu-item-group title="Group One">
            <el-menu-item index="1-1">item one</el-menu-item>
            <el-menu-item index="1-2">item one</el-menu-item>
          </el-menu-item-group>
          <el-menu-item-group title="Group Two">
            <el-menu-item index="1-3">item three</el-menu-item>
          </el-menu-item-group>
          <el-submenu index="1-4">
            <template slot="title">item four</template>
            <el-menu-item index="1-4-1">item one</el-menu-item>
          </el-submenu>
        </el-submenu>
         <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">Navigator Two</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-setting"></i>
            <span slot="title">Navigator Three</span>
          </el-menu-item>
      </el-menu -->
    </el-col>

    <el-col :span="9">
      <el-card class="box-no-padd">
        <div class="card-header">
          <h3 v-show="!editing" @dblclick="startEditTitle()">{{chatId}}: {{chatName}}</h3>
          <div v-show="editing" class="bubble-name">
          <el-row>
            <el-col :span="6">
              <el-input :ref="'titleInputId'" @blur="endEditTitle()" placeholder="Id" v-model="chatId" prefix-icon="fal fa-tag">
              </el-input>
            </el-col>
            <el-col :span="1">
              <div class="div-name">:</div>
            </el-col>
            <el-col :span="17">
              <el-input :ref="'titleInputName'" @blur="endEditTitle()" placeholder="Name" v-model="chatName" prefix-icon="fal fa-comments">
              </el-input>
            </el-col>
          </el-row>
          </div>
        </div>
        <div class="bubble-wrap">
          <div v-for="bubble, index in chat" class="bubble" :class="{right: bubble.type == 'user', left: bubble.type == 'bot'}">
            <div v-html="compiledMarkdown[index]" @dblclick="startEditBubble(index)" v-show="!bubble.editing"></div>
            <div class="bubble-form" v-show="bubble.editing">
              <el-input type="textarea" autosize :ref="'bubbleText'" v-model="bubble.text"  @blur="endEditBubble(index)" placeholder="Insert text here..."></el-input>
            </div>
            <div class="bubble-controls">
              <el-button round size="mini" @click="toggleComp(index)">
                <i class="fal " :class="[bubble.comp == 'equals' ? 'fa-pause fa-rotate-90' : 'fa-play']" ></i>
              </el-button>
            </div>
          </div>
        </div>

        <div class="card-bottom">
          <el-button round @click="removeFromChat" icon="far fa-minus-circle"> Remove last bubble</el-button>
          <el-button round @click="addToChat"  icon="far fa-plus-circle"> Add new bubble</el-button>
        </div>
      </el-card>
    </el-col>

    <el-col :span="8">
      <el-card class="box-no-padd">
        <div class="feature">
          <el-button round @click="generateFeature" icon="fal fa-magic"> Generate feature file</el-button>
          <pre>{{featureText}}</pre>
        </div>
      </el-card>
    </el-col>    
  </el-row>
</div>
</template>

<script>
import marked from 'marked'
import _ from 'lodash'
import FontAwesomeIcon from '@fortawesome/vue-fontawesome'

let placeHolderText = "*Insert text here...*";

export default {
  data() {
      return {
        chatId:"HP",
        chatName:"Happy Path",
        editing: false,
        chat: [{
          order:0,
          type:"bot",
          text:"Hola don pepito",
          comp:"equals",
          editing:false
        },
        {
          order:1,
          type:"user",
          text:"Hola don jose",
          comp:"equals",
          editing:false
        },
        {
          order:2,
          type:"bot",
          text:"adios",
          comp:"equals",
          editing:false
        }],
        compareTypes: [{
          value: 'equals',
          label: '='
        },{
          value: 'startwith',
          label: '<'
        }],
        placeHolder: "*Insert text here...*",
        featureText: ""
      };
  },
  computed: {
    compiledMarkdown: function() {
      return this.chat.map(function(item) {
          if( item.text == "" ){
            return marked(placeHolderText, { sanitize: true });
          }
          return marked(item.text, { sanitize: true });
      });
    }
  },
  methods: {
      generateFeature(){
        this.featureText = "Scenario: "+ this.chatId + " " + this.chatName + "\n";
        for (var i = 0; i < this.chat.length; i++) {
          var prefix = (this.chat[i].type == "user") ? "When use say " : "Then chatbot answer ";
          this.featureText += "   " + prefix + this.chat[i].text + "\n";
        }
      },
      startEditTitle(){
        this.editing = true;
        this.$nextTick(() => {
          let input = this.$refs.titleInputId;
          input.focus();
        });
      },
      endEditTitle(){
        this.$nextTick(() => {
          if( !this.$refs.titleInputId.focused && !this.$refs.titleInputName.focused ){
            this.editing = false;
          }
        });
      },
      toggleComp(index){
        var value = this.chat[index].comp;
        console.log("Aqui "+value);
        this.chat[index].comp = (value == "equals") ? "startwith" : "equals";

      },
      startEditBubble(index){
        this.chat[index].editing = true;
        this.focusBubleInput(index);
      },
      endEditBubble(index){
        console.log("Hola");
        this.chat[index].editing = false;
      },
      removeFromChat(){
        this.chat.pop();
      },
      addToChat(){
        var last = this.chat.slice(-1).pop();
        var newChat = {
          order: last.order + 1,
          type: last.type == "user" ? "bot" : "user",
          text: "",
          comp: "equals",
          editing: true
        };
        this.chat.push(newChat);
        this.focusBubleInput(this.chat.length-1);
      },
      focusBubleInput(index){
        this.$nextTick(() => {
          let input = this.$refs.bubbleText[index];
          input.focus();
        });
      }
    },
    components: {
      FontAwesomeIcon
    }
}
</script>

<style>
body{
    font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif;
    font-weight: 400;
    -webkit-font-smoothing: antialiased;
    margin: 0px;
    background-color: #f7f7f7;
    font-size: 14px;
}

.el-header, .el-footer {
  background: #e82323;
  color: #fff;
  text-align: center;
  line-height: 70px;
}
.el-header > h1 {
  margin: 0px;
}

.el-button--mini, .el-button--mini.is-round {
  padding: 4px 5px;
}
.el-button--mini {
  font-size: 9px;
}
.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 300px;
}
 .el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

  .div-name{
    text-align: center;    
    font-size: 19px;
    padding-top: 6px;
  }
  .bubble-name{
    display: inline-block;
  }
  .el-card{
    margin-top: 20px;
  }
  .card-header > h3{
    margin: 0px;
    color: #606266;
  }
  .card-header {
    padding: 15px;
  }
  .card-bottom{
    padding: 15px;
  }
  .box-no-padd > .el-card__body {
    padding: 0px;
  }
  .bubble.left > .bubble-controls {
    bottom: -4px;
    position: absolute;
    left: -25px;
  }
  .bubble.right > .bubble-controls {
    bottom: -6px;
    position: absolute;
    right: -26px;
  }
  .bubble-wrap{
    padding: 5px 10px;
    background-color: #f7f7f7;
  }
  .bubble {
    position: relative;
    padding: 0px 15px;
    margin: 10px 0 10px;
    border: 2px solid;
    color: #68696f;
    background: #fff;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    border-radius: 10px;
  }
  .bubble-form > .el-textarea {
    margin: 15px 0px;
  }
  .bubble-form >  .bubble-controls{
    margin-bottom: 10px;
  }
  .bubble.right {
    border-color: #b3b7bf;
    margin-right: 20px;
  }
  .bubble.left {
    border-color: #F44336;
    margin-left: 20px;
  }
  .bubble:before {
      content: "";
      position: absolute;
      border-style: solid;
      display: block;
      width: 0;
  }
  .bubble:after {
      content: "";
      position: absolute;
      border-style: solid;
      display: block;
      width: 0;
  }
  .bubble.right:before {
    top: 14px;
    bottom: auto;
    left: auto;
    right: -20px;
    border-width: 11px 0px 11px 20px;
    border-color: transparent #c0c4cc;
  }
  .bubble.right:after {
      top: 16px;
      bottom: auto;
      left: auto;
      right: -16px;
      border-width: 9px 0 9px 17px;
      border-color: transparent #fff;
  }
  .bubble.left:before {
      top: 10px;
      bottom: auto;
      left: -20px;
      border-width: 11px 20px 11px 0;
      border-color: transparent #F44336;
  }
  .bubble.left:after {
      top: 12px;
      bottom: auto;
      left: -16px;
      border-width: 9px 17px 9px 0;
      border-color: transparent #fff;
  }
</style>
