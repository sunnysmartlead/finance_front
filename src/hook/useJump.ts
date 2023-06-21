import { useRouter } from "vue-router"
import { useTagsViewStore,ITagView } from "@/store/modules/tags-view"

export default function useJump() {
  const router = useRouter()
  const tagsViewStore = useTagsViewStore()

  const jumpTodoCenter = () => {
    router.push({
      path: "/todoCenter/index"
    })
  }

  const closeSelectedTag = (path:any) => {
    try {
      var value: ITagView={}
      tagsViewStore.visitedViews.forEach(a=>{
         if(a.path==path)  return value=a;
      })
      tagsViewStore.delVisitedView(value)
      router.push({
        path: "/todoCenter/index"
      })
    } catch (error) {
      console.log("closeSelectedTag",error)
    }
  }

  const jumpPage = (path: any, query: any) => {
    router.push({
      path,
      query
    })
  }
  return {
    jumpTodoCenter,
    jumpPage,
    closeSelectedTag
  }
}
