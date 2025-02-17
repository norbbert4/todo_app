<style>
    .list-group-item a {
        cursor: pointer;
        user-select: none;
    }
    .list-group-item[title="<?php echo $pageScript; ?>"] {
        background-color: #0b5ed7;
        color: white;
    }

    .list-group-item[title="<?php echo $pageScript; ?>"] a {
        color: white;
        cursor: default;
    }
</style>


<nav>

    <a class="btn btn-primary disabled placeholder col-12 mb-3" aria-disabled="true">Menü</a>

    <ul class="list-group mb-3">
        <li class="list-group-item" title="Teendők">
            <a href="./todos.php">Teendők</a>
        </li>
    </ul>
    
    <ul class="list-group mb-3">
    <li class="list-group-item" title="Felhasználók">
            <a href="./users.php">Felhasználók</a>
        </li>
    </ul>

</nav>