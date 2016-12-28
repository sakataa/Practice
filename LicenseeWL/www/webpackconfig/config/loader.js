var commonLoaders = [
   { test: require.resolve("jquery"), loader: "expose-loader?$!expose-loader?jQuery" }
]

module.exports = {
    commonLoaders: commonLoaders
}