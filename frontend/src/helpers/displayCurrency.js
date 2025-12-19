const displayDZDCurrency = (num) => {
    const formatter = new Intl.NumberFormat('fr-DZ', {
        style: "currency",
        currency: 'DZD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })

    return formatter.format(num).replace('DZD', 'DA')

}

export default displayDZDCurrency
