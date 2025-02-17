<?php
$pageTitle = 'Admin - Felhasználók';
$pageScript = 'users';
include './components/header.php';
include './components/navigation.php';
?>

    <main>

        <nav class="bg-body-dark p-2 mb-2 text-end d-flex flex-row-reverse">
            <a class="btn btn-sm btn-danger" href="logout.html">Kijelentkezés</a>
            <p class="py-0 px-4 m-0">Bejelentkezve: <span class="logged"><span></p>
        </nav>

        <!-- TÁBLÁZAT -->
        <table class="table table-striped table-bordered border-secondary ">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>teljes név</th>
                    <th>felhasználónév</th>
                    <th>állapot</th>
                    <th>vezérlők</th>
                </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
        <div class="btn btn-primary" id="ujGomb">Új felhasználó</div>

        <!-- ŰRLAP -->
        <div id="editbox" class="box-hide">
            <div class="content">
                Űrlap
            </div>
            <div class="close"></div>
        </div>

    </main>

</body>
</html>