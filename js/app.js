
// Veriables
const cartBtn = document.querySelector(".cart__btn");
const cartItems = document.querySelector(".cart__items");
const cartDOM = document.querySelector(".cart");
const closeCartBtn = document.querySelector(".close__cart");
const clearCartBtn = document.querySelector(".clear__cart");
const cartOverlay = document.querySelector(".cart__overlay");
const cartContent = document.querySelector(".cart__content");
const productsDOM = document.querySelector(".products__center");
const cartTotal = document.querySelector(".cart__total");
// cart
let cart = [];
let buttonsDom = [];
// getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.items;

            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            });
            return products;
        } catch (error) {
            console.log(error);
        }
    }
}
// display products
class UI {
    displayProducts(products) {
        let result = "";
        products.forEach(i => {
            result += `
                <!-- Single Product -->
                <article class="product">
                    <div class="img__container">
                        <img src="${i.image}" class="product__img">
                        <button class="bag__btn" data-id="${i.id}">
                            <i class="fas fa-shopping-cart"></i>
                            add to bag
                        </button>
                    </div>
                    <h3>${i.title}</h3>
                    <h4>$${i.price}</h4>
                </article>
                <!-- End of Single Product -->
            `
        });
        productsDOM.innerHTML = result;
    }
    addToBag() {
        let buttons = [...document.getElementsByClassName("bag__btn")];
        buttonsDom = buttons;
        buttons.forEach(i => {
            let id = parseInt(i.dataset.id);
            let inCart = cart.find(item => item.id == id);
            if (inCart) {
                i.innerText = "In Cart";
                i.disabled = true;
            }
            i.addEventListener("click", event => {
                i.innerText = "In Cart";
                i.disabled = true;
                // get prosduct from products 
                let cartItem = { ...Storage.getProsduct(id), amount: 1 };
                // add product to the cart
                cart = [...cart, cartItem];
                // save cart in Local Storage
                Storage.saveCart(cart);
                // set cart values
                this.setCartValue(cart);
                // display cart items
                this.addCartItem(cartItem);
                // show the cart
                this.popUp(cartItem);

                setTimeout(() => {
                    this.removePop(cartItem);
                }, 4000);
            })
        })
    }
    popUp(cartItem) {
        let popUp = document.createElement("img");
        popUp.classList.add("popItem");
        popUp.src = cartItem.image;
        document.querySelector(".pop").appendChild(popUp);
    }
    removePop() {
        let popItem = document.querySelectorAll(".popItem")[0];
        popItem.remove();
    }
    setCartValue(cart) {
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        })
        cartTotal.innerHTML = tempTotal.toFixed(2);
        cartItems.innerHTML = itemsTotal;
    }
    addCartItem(cartItem) {
        cartContent.innerHTML += `<div class="cart__item">
            <img src="${cartItem.image}" class="cart__img">
            <div>
                <h4>${cartItem.title}</h4>
                <h5>$ ${cartItem.price}</h5>
                <span class="remove__item" data-id="${cartItem.id}">remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id="${cartItem.id}"></i>
                <p class="item__amount">${cartItem.amount}</p>
                <i class="fas fa-chevron-down" data-id="${cartItem.id}"></i>
            </div>
        </div>`
    }
    cartEvents() {
        // let removeButton = [...document.querySelectorAll(".remove__item")];
        // removeButton.forEach(i => {
        //     i.addEventListener("click", event => {
        //         let id = i.dataset.id;
        //         console.log(id);
        //         const carts = Storage.remove(id)
        //         console.log(carts);
        //         i.parentElement.parentElement.remove();
        //         Storage.saveCart(carts);
        //         this.setCartValue(carts);
        //     })
        // })
        clearCartBtn.addEventListener("click", () => {
            cartItems.innerHTML = 0;
            cartContent.innerHTML = "";
            buttonsDom.forEach(i => {
                i.disabled = false;
                i.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
            });
            cart.length = 0;
            this.setCartValue(cart);
            Storage.saveCart(cart);
            console.log(cart);
        })
        cartDOM.addEventListener("click", event => {
            if (event.target.classList.contains("remove__item")) {
                let id = event.target.dataset.id;
                cart = Storage.remove(id);
                event.target.parentElement.parentElement.remove();
                this.setCartValue(cart);
                Storage.saveCart(cart);
                buttonsDom.forEach(i => {
                    if (i.dataset.id == id) {
                        i.disabled = false;
                        i.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
                    }
                })

            }
            if (event.target.classList.contains("fa-chevron-up")) {
                let id = event.target.dataset.id;
                let cartItem = cart.find(i => i.id == id);
                cartItem.amount += 1;

            }
            if (event.target.classList.contains("fa-chevron-down")) {
                let id = event.target.dataset.id;
            }
        })

    }
    showCart() {
        cartOverlay.classList.add("transparentBcg");
        cartDOM.classList.add("showCart");
    }
    hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart")
    }
    memory() {
        cart = Storage.getCart();
        this.setCartValue(cart);
        cart.forEach(i => {
            this.addCartItem(i);
        });
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
    }
}
// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProsduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
    static saveCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return localStorage.getItem("cart")
            ? JSON.parse(localStorage.getItem("cart"))
            : [];
    }
    static remove(id) {
        return cart.filter(item => item.id != id);
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    ui.memory();
    products.getProducts()
        .then(products => {
            ui.displayProducts(products);
            Storage.saveProducts(products);
        })
        .then(() => {
            ui.addToBag();
            ui.cartEvents();
        });
});
// class userName {
//     async getUserName() {
//         try {
//             let name = await "Sanjarbek";
//             return name;
//         } catch (error) {
//             alert("Xatolik");
//         }
//     }


// }
// const ooo = new userName();
// ooo.getUserName().then(name => console.log(name));
