import store from "@/store"
import { defineStore } from "pinia"
import { getProductByAuditFlowId } from "@/views/productList/service"

interface ProductState {
  productList: any[]
  productId: number | string
}

export const useProductStore = defineStore({
  id: "productList",
  state: (): ProductState => {
    return {
      productList: [],
      productId: ""
    }
  },
  actions: {
    async setProductList(id: number) {
      const res: any = await getProductByAuditFlowId(id)
      this.productList = res.result
    },
    setProductId(id: number | string) {
      this.productId = id
      // window.sessionStorage.setItem("productId", this.productId + "")
    }
  }
})

/** 在 setup 外使用 */
export function useProductStoreHook() {
  return useProductStore(store)
}
