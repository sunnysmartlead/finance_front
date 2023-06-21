import { onMounted, ref } from "vue"
import getQuery from "@/utils/getQuery"

export default function useQueryData() {
  let query = getQuery()
  let auditFlowId = ref(0)
  let productId = ref(0)
  onMounted(() => {
    auditFlowId.value = Number(query.auditFlowId) || 1
    productId.value = Number(query.productId) || 1
  })
  return {
    auditFlowId,
    productId
  }
}
