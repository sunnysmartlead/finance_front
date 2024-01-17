import { bigNumberTransform } from "./util"

export const percentageCostChartData = {
  title: {
    text: "产品成本占比",
    subtext: "",
    left: "center"
  },
  tooltip: {
    trigger: "item",
    formatter: "{a} <br/> {b} , 值:{c};百分比:({d}%)"
  },
  legend: {
    orient: "vertical",
    left: "left",
    show: false
  },
  label: {
    alignTo: "edge",
    // formatter: (item: any) => {
    //   // console.log(item, "itemitem")
    //   return `${item.name}: 值: ${(item.value * 1).toFixed(2)} 百分比:{d}%`
    // },
    formatter: "{b}:{c}: ({d}%)",
    minMargin: 5,
    edgeDistance: 10,
    lineHeight: 15,
    rich: {
      time: {
        fontSize: 10,
        color: "#999"
      }
    }
  },
  series: [
    {
      name: "产品成本",
      type: "pie",
      radius: "50%",
      data: [
        { value: 0, name: "bom成本" },
        { value: 0, name: "损耗成本" },
        { value: 0, name: "制造成本" },
        { value: 0, name: "物流成本" },
        { value: 0, name: "质量成本" },
        { value: 0, name: "其他成本" }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)"
        }
      }
    }
  ]
}

export const costChartData = {
  title: {
    text: "产品成本利润分布图 - 客户目标价",
    subtext: "",
    left: "center"
  },
  grid: {
    left: "3%",
    right: "10%",
    bottom: "3%",
    containLabel: true
  },
  xAxis: {
    type: "category",
    splitLine: { show: false },
    data: ["bom成本", "损耗成本", "制造成本", "物流成本", "质量成本", "MOQ分摊成本", "其他成本", "利润"],
    axisLabel: {
      interval: 0,
      rotate: 0,
      margin: 10
    }
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      type: "bar",
      showBackground: true,
      stack: "Total",
      label: {
        show: true,
        position: "top",
        formatter: (item: any) => {
          return bigNumberTransform(item.value || 0)
        }
      },
      backgroundStyle: {
        color: "rgba(180, 180, 180, 0.2)"
      },
      data: [0, 0, 0, 0, 0, 0, 0, 0]
    }
  ]
}

export const selectCostChartData = {
  xAxis: {
    type: "category",
    data: ["2021", "2022", "2023", "2024", "2025", "2026", "2027"]
  },
  yAxis: {
    type: "value"
  },
  series: [
    {
      data: [],
      type: "line",
      label: {
        show: true,
        position: "top",
        formatter: (item: any) => {
          return item.value
        }
      },
      smooth: true
    }
  ]
}

export const dashboardPannel = [
  {
    title: "BOM成本",
    value: "1"
  },
  {
    title: "损耗成本",
    value: "2"
  },
  {
    title: "制造成本",
    value: "3"
  },
  {
    title: "物流成本",
    value: "4"
  },
  {
    title: "质量成本",
    value: "5"
  },
  {
    title: "其他成本",
    value: "6"
  }
]
