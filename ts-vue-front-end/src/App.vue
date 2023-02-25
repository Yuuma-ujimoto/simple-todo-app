<template>
  <div class="wrapper">

    <div class="border-r-2 p-8">
      <div v-if="isLogin">
        <p>タスク一覧</p>
        <ul>
          <li v-for="(Todo,index) in todos" :key="index">{{ Todo.title }}</li>
        </ul>
      </div>
      <div v-else>
        <button
            @click="GoogleLogin"
            type="button"
            class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
        >
          ログイン
        </button>
      </div>
    </div>
    <div class="border-l-2 p-8">
      <dl>
        <dt>
          <p>タスク名</p>
        </dt>
        <dd>
          <input type="text" class="border w-1/2　p-2" v-model="addTodoData.title">
        </dd>
        <dt>
          <p>タスク内容</p>
        </dt>
        <dd>
          <textarea class="resize-none border w-1/2 p-2" v-model="addTodoData.description">
          </textarea>
        </dd>
        <dt>
          <p>タスク種別</p>
        </dt>
        <dd>
          <select
              class="block appearance-none w-1/2 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              v-model="addTodoData.type">
            <option value="one" selected>単発タスク</option>
            <option value="day">デイリータスク</option>
            <option value="week">ウィークリータスク</option>
            <option value="month">マンスリータスク</option>
          </select>
        </dd>
        <dd>
          <button @click="addTodo">追加</button>
        </dd>
      </dl>
    </div>
  </div>
</template>
<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {auth} from "./plugins/firebase";
import {GoogleAuthProvider,signInWithRedirect} from "firebase/auth";
import axios from "axios";

// TODO関連処理
const todos = ref<TodoData[]>([])

type TodoData = {
  title:string,
  type:"one"|"day"|"week"|"month",
  description:string
}

const addTodoData = ref<TodoData>({
  title: "",
  type: "one",
  description: ""
})


const addTodo = () => {
  todos.value.push(addTodoData.value)
  addTodoData.value = {
    title: "",
    type: "one",
    description: ""
  }
}


// ログイン関連処理
const isLogin = ref<boolean>(false)
onBeforeMount(()=>{

  auth.onAuthStateChanged(async ()=>{
    console.log("state change")
    const user = auth.currentUser
    console.log(user)
    isLogin.value = !!user

    if (!!user){
      const authToken = await user.getIdToken()
      console.log(authToken)

    }

  })


})
const GoogleLogin = async ()=>{
  const provider = new GoogleAuthProvider()
  const authResult = await signInWithRedirect(auth,provider)
  console.log(authResult)
  if (!auth.currentUser){
    return
  }
  const authToken = await auth.currentUser.getIdToken()
  const axiosURL = "http://localhost:3000/users"
  const axiosConfig = {
    headers:{
      authorization:`Barber ${authToken}`
    }
  }
  const axiosResult = await axios.post(axiosURL,axiosConfig)
  console.log(axiosResult)
  isLogin.value = true
}

</script>
<style scoped>
.wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  min-height: 300px;
}

.wrapper div {
  width: 50%;
  box-sizing: border-box;
}

.todo-form {
  border-left: solid 1px;
}

.todo-list {
  border-right: solid 1px;
}
</style>
