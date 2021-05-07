module.exports = api => {
  debugger
  const isTest = api.env('test')
  if (isTest) {
    return {
      presets: [['@babel/preset-env', {targets: {node: 'current'}}]]
    }
  }
  return {}
}
