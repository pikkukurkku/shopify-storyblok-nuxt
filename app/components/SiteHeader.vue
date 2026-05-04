<template>
    <header class="site-header">
        <NuxtLink to="/" class="logo">My Shop</NuxtLink>
        <nav>
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/products">Products</NuxtLink>
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
}
</style>
