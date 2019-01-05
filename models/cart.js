module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            }
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        storedItem.price = Math.round(storedItem.price * 100) / 100;

        this.totalQty++;
        this.totalPrice += storedItem.item.price;
        this.totalPrice = Math.round(this.totalPrice * 100) / 100;
    }

    this.remove = function (item, id) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item,
                qty: 0,
                price: 0
            }
        }
        storedItem.qty--;
        storedItem.price = storedItem.item.price * storedItem.qty;
        storedItem.price = Math.round(storedItem.price * 100) / 100;
        this.totalQty--;
        this.totalPrice -= storedItem.item.price;
        this.totalPrice = Math.round(this.totalPrice * 100) / 100;
    }

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id])
            if (this.items[id].qty === 0) {
                arr.splice(arr.indexOf(this.items[id]), 1)
            }
        }

        return arr
    }
}