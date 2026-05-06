<script setup>
const { customer, isLoggedIn } = useCustomer()
const { lineCount } = useCart()
</script>

<template>
    <header class="site-header">
        <NuxtLink to="/" class="logo">My Shop</NuxtLink>
        <nav>
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/products">Products</NuxtLink>
            <NuxtLink to="/cart" class="cart-link">
                Cart
                <span v-if="lineCount > 0" class="cart-badge">{{ lineCount }}</span>
            </NuxtLink>
            <template v-if="isLoggedIn">
                <NuxtLink to="/account">Hi, {{ customer.firstName || 'there' }}</NuxtLink>
                <a href="/api/auth/logout">Logout</a>
            </template>
            <a v-else href="/api/auth/login">Login</a>
        </nav>
    </header>
</template>

<style scoped>
.site-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    border-bottom: 1px solid #eee;
}

.logo {
    font-weight: bold;
    font-size: 1.25rem;
}

nav {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.cart-link {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}

.cart-badge {
    background: #000;
    color: #fff;
    font-size: 0.75rem;
    line-height: 1;
    padding: 0.2rem 0.45rem;
    border-radius: 999px;
    min-width: 1.25rem;
    text-align: center;
}
</style>
