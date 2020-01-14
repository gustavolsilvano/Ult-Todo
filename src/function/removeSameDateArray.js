const removeSameDateArray = (arrToAn) => {

    let sameDateFilter = (dateToFilter) => {
        return arrToAn.filter(el => el.date === dateToFilter)
    }

    let sameDateArray = []
    let i = 0;
    for (i; i < arrToAn.length; i++) {
        if (sameDateFilter(arrToAn[i].date).length > 1) {
            sameDateArray = sameDateFilter(arrToAn[i].date)
            break
        }
    }
    let newArrayItem = []

    sameDateArray.forEach(el => {
        el.itens.forEach(elItem => newArrayItem.push(elItem))
    })
    let newCard = { ...sameDateArray[0], itens: newArrayItem }
    let restCard = arrToAn.filter(el => el.date !== newCard.date)
    let finalCardList = []
    if (sameDateArray.length > 0) {
        finalCardList = [...restCard, newCard]

    } else {
        finalCardList = [...restCard]
    }

    return finalCardList;
}

export default removeSameDateArray;