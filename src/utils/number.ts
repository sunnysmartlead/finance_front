export const formatThousandths = (_record: any, _row: any, cellValue: any) => {
  if (cellValue) {
    return (Number(cellValue).toFixed(2) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}

export const formatThousandthsIndex = (_record: any, _row: any, cellValue: any,index:number=2) => {
  if (cellValue) {
    return (Number(cellValue).toFixed(index)).replace(/(\d)(?=(\d{3})+\.)/g, ($0, $1) => {return $1 + ",";}).replace(/\.$/, "")
  }else {
    return 0
  }
}

export const formatThousandthsNoFixed = (_record: any, _row: any, cellValue: any) => {
  if (cellValue) {
    return (Number(cellValue) + "").replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,")
  } else {
    return 0
  }
}
