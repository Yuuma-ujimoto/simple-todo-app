<template>
  <div class="wrapper flex-col">
    <header id="header" class="flex justify-between p-5 border-b-4">
      <p>Simple Todo App</p>
      <button
          v-show="isLogin"
          @click="signOut"
          type="button"
          class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-gray-500 text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
      >
        ログアウト
      </button>
      <button
          v-show="!isLogin"
          @click="GoogleLogin"
          type="button"
          class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
      >
        ログイン
      </button>
    </header>
    <div id="task-wrapper" v-if="isLogin" class="flex flex-row w-full">
      <div id="task-list" class="border-r-2 p-8 w-1/2">
        <p class="text-xl">タスク一覧</p>
        <ul>
          <li v-for="(Todo,index) in todos" :key="index">{{ Todo.title }}</li>
        </ul>

      </div>
      <div id="task-form" class="border-l-2 p-8 w-1/2">
        <dl>
          <dt>
            <p class="text-xl">タスク登録</p>
          </dt>
          <dt class="pt-5">
            <p>タスク名</p>
          </dt>
          <dd class="pt-5">
            <input type="text" class="border w-4/5 p-2" v-model="addTodoData.title">
          </dd>
          <dt class="pt-5">
            <p>タスク内容</p>
          </dt>
          <dd class="pt-5">
          <textarea class="resize-none border w-4/5 p-2" v-model="addTodoData.description">
          </textarea>
          </dd>
          <dt class="pt-5">
            <p>タスク種別</p>
          </dt>
          <dd class="pt-5">
            <select
                class="block appearance-none w-4/5 bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                v-model="addTodoData.type">
              <option value="one" selected>単発タスク</option>
              <option value="day">デイリータスク</option>
              <option value="week">ウィークリータスク</option>
              <option value="month">マンスリータスク</option>
            </select>
          </dd>
          <dd class="flex w-4/5 pt-5">
            <input
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                type="checkbox"
                id="repeat">
            <label
                for="repeat"
                class="ml-2 text-sm font-medium text-gray-900">
              繰り返し
            </label>
          </dd>
          <dd class="pt-5">
            <button
                @click="addTodo"
                class="py-3 w-1/3 mt-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"

            >追加
            </button>
          </dd>
        </dl>
      </div>


    </div>

  </div>
</template>
<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {auth} from "./plugins/firebase";
import {GoogleAuthProvider, signInWithRedirect} from "firebase/auth";
import axios from "axios";
import {CallAPI} from "./components/Axios";

// TODO関連処理
const todos = ref<TodoData[]>([])

type TodoData = {
  title: string,
  type: "one" | "day" | "week" | "month",
  description: string
}

const addTodoData = ref<TodoData>({
  title: "",
  type: "one",
  description: ""
})


const addTodo = async () => {
  const todoData = addTodoData.value
  if (!todoData.type || !todoData.title || !todoData.description) {
    alert("データが足りません。")
    return
  }
  // 楽観的UIで実装する為エラー時の巻き戻し用のデータを保持しておく
  const rollbackTodo = Array.from(todos.value)
  todos.value.push(addTodoData.value)

  addTodoData.value = {
    title: "",
    type: "one",
    description: ""
  }


  const user = auth.currentUser
  if (!user) {
    // 意図しない挙動なので巻き戻し
    todos.value = rollbackTodo
    return
  }
  const authToken = await user.getIdToken()
  console.log(authToken)
  const axiosURL = "localhost:3000/tasks/"
  const axiosConfig = {

  }

}


// ログイン関連処理
const isLogin = ref<boolean>(false)
onBeforeMount(() => {

  auth.onAuthStateChanged(async () => {
    console.log("state change")
    const user = auth.currentUser
    console.log(user)
    isLogin.value = !!user

    if (!!user) {
      // const authToken = await user.getIdToken()
      // console.log(authToken)
      // const axiosURL = "http://localhost:3000/tasks"
      // const axiosConfig = {
      //   headers: {
      //     authorization: `Barber ${authToken}`
      //   }
      // }
      // const axiosResult = await axios.get(axiosURL, axiosConfig)
      const axiosResult = CallAPI.access("tasks","get",true)
      console.log(axiosResult)
    }

  })


})

const GoogleLogin = async () => {
  console.log("1")
  const provider = new GoogleAuthProvider()
  console.log("2")
  const authResult = await signInWithRedirect(auth, provider)
  console.log(authResult)
  if (!auth.currentUser) {
    return
  }
  const authToken = await auth.currentUser.getIdToken()
  const axiosURL = "http://localhost:3000/users"
  const axiosConfig = {
    headers: {
      authorization: `Barber ${authToken}`
    }
  }
  const axiosResult = await axios.post(axiosURL, axiosConfig)
  console.log(axiosResult)
  isLogin.value = true
}

const signOut = async () => {
  await auth.signOut()
  isLogin.value = false
}

</script>
<style scoped>
header {
  height: 10%;
  position: fixed;
  width: 100%;
}

#task-wrapper {
  min-height: 90%;
  overflow-y: scroll;
  position: fixed;
  top: 10%;
}
</style>
