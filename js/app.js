
// veriables
const cartBtn = document.querySelector(".cart__btn");
const cartItems = document.querySelector(".cart__items");
const cartDOM = document.querySelector(".cart");
const closeCartBtn = document.querySelector(".close__cart");
const clearCartBtn = document.querySelector(".clear__cart");
const cartOverlay = document.querySelector(".cart__overlay");
const cartContent = document.querySelector(".cart__content");
const productsDOM = document.querySelector(".products__center");
const cartTotal = document.querySelector(".cart__total");

// const bagBtn = document.querySelector("bag__btn");
// const navMenu =document.querySelector("fa-bars");
// const addItem = document.querySelector("fa-chevron-up");
// const decreaseBtn = document.querySelector("fa-chevron-down");

// cart
let cart = [];
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
}

// local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products);
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
