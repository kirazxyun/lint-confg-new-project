## 新项目代码规范配置

#### 规范检查器：standard

standard是目前使用时最为广泛的，其规则是从eslint中抽取的，基本是对js的基础验证，相较于其他风格的检查器比较适合我们小组。

关于standard的配置非常的简单，首先它的规则列表是无法变动的，所以我们只需要将关注点放在环境上，配置参数如下：

```json
//package.json
{
    "standard": {
      	"ignore": [], // glob 形式的排除列表 (一般无须配置)
        "envs": [],   // eslint 环境
      	"globals": [],// 声明需要跳过检测的定义全局变量
      	"plugins": [],// eslint 插件列表
      	"parser": ""  // js 解析器（例如 babel-eslint）
    }
}
```

#### 结合fet

fet默认集成的代码规范检查器也是standard，我们可以使用fet lint检查代码规范，其配置配置在ft.confg.js的lint属性中，如下：

```javascript
//ft.config.js
export.lint = {
    cwd: 'src/js', // 选择需要校验的文件路径，默认是src
    opts: {
      ignore: [],   // glob 形式的排除列表 (一般无须配置)
      fix: false,   // 是否自动修复问题
      globals: [],  // 声明需要跳过检测的定义全局变量
      plugins: [],  // eslint 插件列表
      envs: [],     // eslint 环境
      parser: ''    // js 解析器（例如 babel-eslint）
    }
}
```

#### 构建时检查

目前fet集成的规范检查命令是独立的，所以为了能够在构建的时候随时检查代码规范，解决方案为在webpack的配置中添加standard-loader

```javascript
// build/webapck.jsconfig.js
module.exports = {
    module: {
        rules: [{
        test: /\.(js|vue)$/,
        loader: 'standard-loader',
        enforce: 'pre',
        include: [resolve('src'), resolve('test')],
        options: {
          error: false, // Emit errors instead of warnings (default = false)
          snazzy: true, // enable snazzy output (default = true)
          fix: falese, //是否自动修复，默认false
          parser: 'babel-eslint'// other config options to be passed through to standard
        }
      }]
    }
}
```

我们为.js和.vue文件添加了一个standard-loader，这样在构建的时候就会运行standard代码检查器。

#### 共享standard配置

因为standard-loader默认读取的是package中的配置，或者是options里面的，为了能够和fet共享一份standard配置，就得将standard的配置放到package里面。

解决方案为：在build目录中新建lint.config.js用于读取package中standard配置，并加上fet lint的配置，然后在ft.config.js中引入，如下：

```javascript
// build/lint.config.js
var config = require('../package.json').standard || {};

config.fix = false;

module.exports = {
  cwd: '',
  opts: config
};

```

```javascript
// ft.config.js
var lintConfig = require('./lint.config.js')
export.lint = lintConfig
}
```

#### 集成编辑器

代码总是一些一大堆，如果都堆积到构建的时候才去检查，要费更大的功夫去修复，如果能实时提示是最好不过了。这个的实现，靠的就是在ide中安装插件，实时的检查代码，给出错误提示。

具体查看standard文档的编辑器部分
https://standardjs.com/readme-zhcn.html

#### git提交前检查

为了保证代码的干净，提交前的规范检查是特别重要的。比如说我们为了修复一个很简单的bug，所以快速的写了一段代码，没有经过再次构建就直接提交了，那这段代码就逃过了规范检查。所以为了全面的保证代码的规范性，在git commit这个节点增加一个钩子，再次对代码规范性进行检查。

解决方案：使用husky，并配置package.json，如下：

```json
// package.json
{
    "scripts": {
        "precommit": "fet lint"
    }
}
```

每次对整个项目进行校验还是很影响效率的，所以我们更希望的是，只对某一部分进行检查就可以了，所以再进一步优化，只对修改的部分进行规范检查

解决方案：增加lint-staged，并更改package.json，如下：

```json
// package.json
{
    "scripts": {
        "precommit": "lint-staged"
    },
  	"lint-staged": {
        "src/*.{js,vue}": ["standard --fix", "git add"]
    }
}
```

lint-staged的配置还可以独立为文件：.lintstagedrc，如下：

```json
// .lintstagedrc.json
{
    "src/*.{js,vue}": ["standard --fix", "git add"]
}
```

上面这段的意思是，对文件进行规范性检查之后，将修改的文件add进去。



