module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    this.add = function (item, id) {
        var storedItems = this.items[id];
        if(!storedItems){
            storedItems = this.items[id] = {item: item, qty:0, price: 0};
        }
        storedItems.qty++;
        storedItems.price = storedItems.item.price * storedItems.qty;
        this.totalQty++;
        this.totalPrice += storedItems.item.price;
    };

    this.removeItem = function (item, id) {
      var storedItems = this.items[id];
      if(!storedItems){
          storedItems = this.items[id] = {item: item, qty:0, price: 0};
      }
      if(this.totalQty > 0) {
          storedItems.qty--;
          if (storedItems.qty >= 0 && this.totalQty >= 0) {
              storedItems.price = storedItems.item.price * storedItems.qty;
              this.totalQty--;
              this.totalPrice -= storedItems.item.price;
          }
          else {
              console.log('No item to remove');
          }
      }
    };

    this.RemoveAllItem = function (item, id) {
        var storedItems = this.items[id];
        for (var i = 0; i < item.length; ++i){
            // logic for removing all duplicates elements
        }
    };

    this.generateArray = function () {
        var arr = [];
        for(var id in this.items){
            arr.push(this.items[id]);
        }
        return arr;
    };
};