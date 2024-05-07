import { ref, shallowRef, computed, onMounted, watch, inject } from 'vue'
import { tree as d3Tree, hierarchy as d3Hierarchy } from 'd3-hierarchy'
import axios from 'axios'
import { linkVertical } from 'd3-shape'

export default {
  name: 'Vue-Express-Tree',
  setup() {
    const domain = inject('domain')
    const width = ref(window.innerWidth)
    const height = ref(window.innerHeight)
    const margin = ref(24)
    const selected = ref(null)
    const error = ref(null)
    const hierarchy = ref(null)
    const loading = ref(false)
    const links = shallowRef(null)
    const tree = shallowRef(null)
    const treeLayout = shallowRef(null)
    const viewBox = computed(() => `0 0 ${boundedWidth.value} ${height.value}`)
    const gTransform = computed(() => `translate(${margin.value}px, ${margin.value}px)`)
    const asideMargin = computed(() => `${margin.value}px`)
    const boundedWidth = ref(getBounded(width.value))
    const boundedHeight = ref(getBounded(height.value))
    const hasChildren = computed(() => (children) => children !== undefined)
    const linker = computed(() =>
      (link) => linkVertical()
        .x((d) => d.x)
        .y((d) => d.y)(link),
    )
    const position = computed(() => (pos) => pos + margin.value / 2)
    const attrs = [ 'name', 'description', 'parentName', 'children' ]

    watch([ () => width.value, () => height.value ], async() => {
      width.value = window.innerWidth
      height.value = window.innerHeight
      boundedHeight.value = getBounded(height.value)
      boundedWidth.value = getBounded(width.value)
    })

    onMounted(async() => {
      tree.value = await fetchTree()
      hierarchy.value = d3Hierarchy(...tree.value.data)
      treeLayout.value = setupTreeLayout()
      links.value = setupLinks()
    })

    return {
      asideMargin,
      attrs,
      boundedHeight,
      boundedWidth,
      error,
      gTransform,
      hasChildren,
      height,
      linker,
      links,
      loading,
      margin,
      onClickHandler,
      position,
      selected,
      tree,
      treeLayout,
      viewBox,
      width,
    }

    function getBounded(side) {

      return side - margin.value * 2
    }

    function setupTreeLayout() {

      return d3Tree()
        .size([
          boundedWidth.value,
          boundedHeight.value / hierarchy.value.height,
        ])(hierarchy.value)
    }

    function setupLinks() {

      return hierarchy.value.links()
    }

    async function fetchTree() {

      error.value = tree.value = null
      loading.value = true

      try {

        return await axios(`${domain}/tree`)

      } catch (err) {

        error.value = 'Well that\'s embarassing! Failed to fetch tree data. Please try again later.'
        console.error(err)

      } finally {

        loading.value = false
      }
    }

    function onClickHandler(leaf) {
      selected.value = leaf
    }
  },
  template: /*html*/`
    <div class="tree">
      <Transition
        :duration="500"
        :appear="true"
        type="transition"
        mode="out-in"
        name="fade"
      >
        <div v-if="loading" class="loading">Loading...</div>
      </Transition>

      <Transition
        :duration="500"
        :appear="true"
        type="transition"
        mode="out-in"
        name="fade"
      >
        <div v-if="error" class="error">{{ error.value }}</div>
      </Transition>

      <Transition
        :duration="500"
        :appear="true"
        type="transition"
        mode="out-in"
        name="fade"
      >
        <div v-if="!loading && !error" class="content">
          <aside class="aside">
            <table class="detailTable">
              <tbody>
                <Transition
                  :duration="500"
                  :appear="true"
                  tag="tbody"
                  type="transition"
                  name="fade"
                  v-for="(attr, i) in attrs"
                  mode="out-in"
                >
                  <tr
                    :key="selected?.data[attr] ?? i"
                    class="spaceBetween outer"
                  >
                    <td class="inner">
                      {{ attr }}
                    </td>

                    <td v-if="attr !== 'children'" :class="{ 'inner': true, [attr]: true }">
                      {{ selected?.data[attr] }}
                    </td>

                    <td v-else :class="{ 'inner': true, [attr]: true }">
                      {{
                        selected?.data.children.map(
                          ({ name }) => name
                        ).join(', ')
                      }}
                    </td>
                  </tr>
                </Transition>
                <!-- An extra, empty row for visual cushion -->
                <tr class="spaceBetween outer"><td>&nbsp;</td></tr>
              </tbody>
            </table>
            <img
              v-show="selected !== null"
              src="./close.svg"
              alt="Clear selection"
              @click="() => selected = null"
              class="close"
              title="Clear selection"
            />
          </aside>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
            :viewBox="viewBox"
            role="img"
            class="svg"
            fil="#fefdf8"
          >
            <rect
              x="0"
              y="0"
              width="100%"
              :height="height"
              class="bgRect"
            />
            <template v-if="links !== null">
              <g :style="{ 'transform': gTransform }">
                <path
                  :style="{ 'transform': gTransform }"
                  v-for="link in links"
                  :d="linker(link)"
                  :stroke="hasChildren(link.target.children) ? '#073642' : '#839496'"
                  class="link"
                />
                <g v-if="treeLayout !== null">
                  <g
                    @click="onClickHandler(leaf)"
                    :style="{ 'transform': gTransform }"
                    v-for="leaf in treeLayout.descendants()"
                    :class="{
                      leaf,
                      selected: leaf !== null && selected !== null && leaf.data.name === selected.data.name
                    }"
                  >
                    <circle
                      :class="{ hasChildren: hasChildren(leaf?.children) }"
                      r="10"
                      :cx="leaf.x"
                      :cy="leaf.y"
                    />
                    <text
                      :x="leaf.x"
                      :y="leaf.y"
                      :dy="hasChildren(leaf.children) ? -10 : 10"
                      text-anchor="middle"
                      :dominant-baseline="hasChildren(leaf.children) ? 'text-after-edge' : 'text-before-edge'"
                      class="label"
                    >
                      {{ leaf.data.name }}
                    </text>
                  </g>
                </g>
              </g>
            </template>
          </svg>
        </div>
      </Transition>
    </div>
  `,
}
