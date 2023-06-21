import { useRoute } from "vue-router"
function getQuery(): any {
  const route = useRoute()
  return route?.query
}

export default getQuery
