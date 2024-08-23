declare module 'eslint-plugin-vue' {
  import { Linter } from 'eslint'

  export const plugin: {
    meta: {
      name: string
      version: string
    }
    rules: Record<string, Linter.RuleModule>
    configs: {
      'flat/base': Linter.Config
      'flat/essential': Linter.Config
      'flat/recommended': Linter.Config
      'flat/strongly-recommended': Linter.Config
      'flat/vue3-essential': Linter.Config
      'flat/vue3-recommended': Linter.Config
      'flat/vue3-strongly-recommended': Linter.Config
    }
    processors: Record<string, Linter.Processor>
  }

  export default plugin
}
