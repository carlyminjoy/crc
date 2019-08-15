<template>
    <a class='download' :href='link' target='_blank' download>
        <slot></slot>
    </a>
</template>

<script>

export default {
    name: 'download',
    props: ['link']
}

</script>

<style lang='scss' scoped>

@import './../styles/variables.scss';

a.download {
    text-align:center;
    font-size: 14px;
    text-decoration:none;
    background: $yellow;
    padding: 10px 30px;
    border:none;
    border-radius: 30px;
    color:$dark-blue;
    font-weight: 600;
    transition: 0.3s ease-in-out;
    cursor:pointer;
    @extend %boxshadow;

    &:hover {
        opacity: 0.8;
    }
}

</style>