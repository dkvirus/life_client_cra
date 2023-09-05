module.exports = {
  serverPort: 6060,
  title: 'Style Guide',
  skipComponentsWithoutExample: true,
  exampleMode: 'hide',// 'hide' | 'collapse' | 'expand',
  usageMode: 'expand', // 'hide' | 'collapse' | 'expand'
  propsParser: require('react-docgen-typescript').withCustomConfig(
    './tsconfig.json',{shouldRemoveUndefinedFromOptional:true}
  ).parse
}
