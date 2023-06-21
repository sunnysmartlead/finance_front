import { Directive } from "vue"
import { useUserStoreHook } from "@/store/modules/user"
import { getQueryParam } from "@/utils/index"

/** 权限指令 */
export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const roles = useUserStoreHook().roles
    console.log(useUserStoreHook(), "useUserStoreHook")
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some((role: any) => {
        return permissionRoles.includes(role)
      })
      if (!hasPermission) {
        el.style.display = "none"
      }
    } else {
      throw new Error("need roles! Like v-permission=\"['admin','editor']\"")
    }
  }
}
/** 已办不显示 */
export const havedone: Directive = {
  mounted(el) {
    const val = getQueryParam("right")
    // "1"代表已办，已办按钮不显示
    if (val == "1") {
      el.style.display = "none"
    }
  }
}

export const drag: Directive = {
  mounted(el) {
    el.onmousedown = function (e: any) {
      //做到浏览器兼容
      e = e || window.event
      const diffX = e.clientX - el.offsetLeft
      const diffY = e.clientY - el.offsetTop
      //当拉着box移动时
      document.onmousemove = function (e) {
        // 浏览器兼容
        e = e || window.event
        let left = e.clientX - diffX
        let top = e.clientY - diffY

        if (left < 0) {
          left = 0
        } else if (left > window.innerWidth - el.offsetWidth) {
          left = window.innerWidth - el.offsetWidth
        }

        if (top < 0) {
          top = 0
        } else if (top > window.innerHeight - el.offsetHeight) {
          top = window.innerHeight - el.offsetHeight
        }

        el.style.left = left + "px"
        el.style.top = top + "px"
      }

      // 当鼠标抬起时
      document.onmouseup = function () {
        this.onmousemove = null
        this.onmouseup = null
      }
    }
  }
}
