// 获取分类目录下的所有文件
// export function getClassifyFilesList() {
//   const modules = import.meta.glob('../../public/分类/**', { eager: true })
//   const classTitles = [] // 分类名称
//   const classItems = [] // 分类下的所有物品
//   Object.keys(modules).forEach((path) => {
//     // 具体分类物品得一些属性
//     let item = {
//       className: path.split('/').slice(-2)[0], // 一级分类名称
//       imgPath: import.meta.env.BASE_URL + path.split('/public')[1], // 图片路径
//       name: path.split('/').slice(-1)[0].split('.')[0] // 图片名称除去.后缀
//     }
//     // 正则校验路径中是否存在-符号,所以路径中尽量避免不必要的 - 符号
//     const reg = /-/
//     if (reg.test(path)) {
//       item.className = path.split('/').slice(-2)[0].split('-')[1] // 一级分类名称不需要展示序号
//     }
//     if (reg.test(item.name)) {
//       item.index = item.name.split('-')[0] // 序号
//       item.name = item.name.split('-')[1] // 图片名称不需要展示序号
//     }
//     if (!classTitles.includes(item.className)) classTitles.push(item.className)
//     classItems.push(item)
//   })
//   return { classTitles, classItems }
// }

// 根据路径名截取文件名
export function getFileName(path) {
  return path.substring(path.lastIndexOf('/') + 1)
}
