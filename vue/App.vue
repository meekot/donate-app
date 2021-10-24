<template lang="pug">
ElContainer
  ElMain
    ElRow(style="height:100%" justify="center" align="middle")
      ElCol(:span="24" :md="7" style="max-width: 384px")
        ElCard
          ElRow.preset-list
            ElCol.preset-list--item(:span="24" :md="12" :lg="8" v-for="preset in presetList" :key="preset") 
              ElButton(
                :type="donateValueIsEqual(prettyPreset(preset))? 'success': ''" 
                :autofocus="donateValueIsEqual(prettyPreset(preset))" 
                @click="donateValue = prettyPreset(preset)"
              ) {{activeCurrency.symbol}} {{toUsLocal(prettyPreset(preset))}}
          ElRow(style="margin-top: 20px;")
            ElCol
              ElInput(v-model.number="donateValue").donate-input
                template(#prefix) {{activeCurrency.symbol}} 
                template(#append) 
                  ElDropdown(trigger="click")
                    span.el-dropdown-link {{activeCurrency.code}}
                      ElIcon
                        arrow-down
                    template(#dropdown)
                      ElDropdownMenu
                        ElDropdownItem(v-for="currency in currencyList" :key="currency.code" @click="setActiveCurrency(currency)") {{currency.code}} | {{currency.name}}
          ElRow(style="margin-top: 20px;")
           ElCol
            ElButton(type="primary" :disabled="!donateValue" :loading="donateLoading" style="width: 100%" @click="donate") DONATE
</template>
<script>
import { ElButton, ElCard, ElContainer, ElMain, ElRow, ElCol, ElSpace, ElInput, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon, ElMessageBox  } from 'element-plus'
import {ArrowDown } from '@element-plus/icons'

import {ref, computed} from 'vue'
import {createDonate} from './api'

const presetList = [40, 100, 200, 1000, 2500, 5000]
const suggestion = 40

import currencyList from '../enums/currencyList'

const defaultCurrency = currencyList[0]

const round5 = (x) => Math.ceil(x/5) * 5
const toUsLocal = (str) => Number(str).toLocaleString('en-US') 
const beautyPrice = (price) => {
  const priceStr = price + '' 
  if ((priceStr).length < 3) return round5(price)
  return (round5(Number(priceStr[0] + priceStr[1])) + '').padEnd(priceStr.length, '0')
}
export default {
  setup () {
    const activeCurrency = ref(defaultCurrency)
    const donateValue = ref(suggestion)
    const donateLoading = ref(false)
    const prettyPreset = computed(() => (preset) => {
      if (activeCurrency.value.rate === 1) return preset
      const round = Math.round(preset * activeCurrency.value.rate)
      return beautyPrice(round)
    })  
    const donateValueIsEqual = computed(() => (value) => Number(value) === Number(donateValue.value) )
    return {
      presetList,
      currencyList: computed(() => currencyList.filter(currency => currency.code !== activeCurrency.value.code)),
      activeCurrency,
      setActiveCurrency: (currency) => {
        const newDonateValue = Math.round(donateValue.value / activeCurrency.value.rate * currency.rate)
        donateValue.value = presetList.some(preset => Number(prettyPreset.value(preset)) === donateValue.value)? beautyPrice(newDonateValue) : newDonateValue
        activeCurrency.value = currency
      }, 
      toUsLocal,
      prettyPreset,
      donateValue,
      donateValueIsEqual,
      donateLoading,
      donate: async () => {
        donateLoading.value = true
        try {
          await createDonate(donateValue.value, activeCurrency.value.code)
          ElMessageBox.alert('Thank you for your donation!', 'Congratulations')

        } catch (e) {}
        donateLoading.value = false
      }
    } 
  },
  components: {
    ElContainer,
    ElButton,
    ElCard,
    ElMain,
    ElRow,
    ElCol,
    ElSpace,
    ElInput,
    ElDropdown, 
    ElDropdownMenu, 
    ElDropdownItem,
    ElIcon,
    ArrowDown
  }
}
</script>




<style lang="scss" scoped>

  .preset-list {
    &--item {
      padding: 5px;
      &::v-deep(.el-button) {
        width: 100%;
      }
    }
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409eff;
    display: flex;
    align-items: center;
    &  .el-icon {
      font-size: 12px;
      margin-left: 4px;
    }
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }

  .donate-input {
    &::v-deep(.el-input__inner) {
      font-size: 30px;
    }

    &::v-deep(.el-input__prefix){
      color: var(--el-button-font-color, var(--el-text-color-regular));
      font-size: 18px;
      display: flex;
      align-items: center;
      padding: 0px 5px;
    }
  }
</style>


<style lang="scss">
  body {
    margin: 0;
    height: 100vh;
    #app {
      height: 100%;
      .el-container {
        height: 100%;
        .el-main {
          height: 100%;

        }
      }
    }
  }
</style>