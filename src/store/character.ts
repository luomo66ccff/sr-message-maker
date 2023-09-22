import { gameCharacter, otherCharacter } from '@/assets/data/characterData'
import { setLoadingType } from '@/assets/scripts/setup'
import { nextTick, reactive, toRaw, watch } from 'vue'

const character = reactive<{
  game: { [name: string]: Character }
  other: { [name: string]: OtherCharacter }
  custom: { [name: string]: CustomCharacter }
}>({
  game: gameCharacter,
  other: otherCharacter,
  custom: {}
})

const setWatch = () => {
  setLoadingType('character')
  watch(character.custom, () => {
    nextTick(() => {
      updateDB()
    })
  })
}

let hasDB = true
let db: IDBDatabase

export const updateDB = () => {
  db.transaction('data', 'readwrite')
    .objectStore('data')
    .put({
      id: 0,
      data: toRaw(character.custom)
    })
}

export const getDB = () => {
  console.log('GET - SR Custom indexDB...')
  const _db = window.indexedDB.open('sr-custom')
  _db.onsuccess = (event) => {
    db = (event.target as IDBOpenDBRequest).result
    if (hasDB) {
      db.transaction('data', 'readonly').objectStore('data').get(0).onsuccess = (e) => {
        try {
          const data = (e.target as IDBRequest).result?.data
          if (typeof data === 'string') {
            character.custom = JSON.parse(data)
          } else {
            character.custom = data || {}
          }
        } finally {
          setWatch()
        }
      }
    } else {
      updateDB()
      setWatch()
    }
  }

  _db.onupgradeneeded = (event) => {
    db = (event.target as IDBOpenDBRequest).result
    if (!db.objectStoreNames.contains('data')) {
      hasDB = false
      db.createObjectStore('data', { keyPath: 'id' })
    }
  }
}

try {
  getDB()
} catch (err) {
  console.error(err)
  setLoadingType('character', true)
}

export { character }
