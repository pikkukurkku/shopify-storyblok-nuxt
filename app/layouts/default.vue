<template>
    <div class="site">
        <SiteHeader />
        <main>
            <slot />
        </main>
        <SiteFooter />
    </div>
</template>

<style scoped>
.site {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

main {
    flex: 1;
}
</style>
