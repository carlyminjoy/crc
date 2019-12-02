<template>
    <li>
        <div class='icons'>
            <i class='fa caret' :class="{ 'fa-caret-up' : section.improvement, 'fa-caret-down' : section.decline }"></i>
            <i class='fa' :class="{ 'fa-check' : good, 'fa-exclamation-circle' : !good }"></i>
        </div>
        <p> {{ section.answer }} <br>
            <strong>
                <span v-if='section.bmi'><br>Your BMI is: {{ section.bmi }}.<br><br></span>
                <span v-if='!good' v-html='section.recommendation'>
            </strong>
        </p>
    </li>
</template>

<script>

export default {
    name: 'feedback',
    props: ['section', 'good']
}

</script>

<style lang='scss' scoped>
div.icons {
    display:flex;
    justify-content:space-between;

    i.caret {
        width: 30px;
        margin-right: 0!important;
    }
}
</style>