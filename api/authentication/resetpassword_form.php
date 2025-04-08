<?php
$token = isset($_GET['token']) ? htmlspecialchars($_GET['token']) : '';
?>
<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jelszó visszaállítása</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../../assets/css/style.css">
    <script src="../../assets/js/resetpassword.js" defer></script>
</head>
<body class="d-flex align-items-center justify-content-center vh-100">
    <div class="container">
        <div class="row justify-content-center align-items-center">
            <div class="col-md-5 text-center text-white">
                <h1 class="login_bal_text">Jelszó visszaállítása</h1>
                <p class="login_bal_text_kis">Add meg az új jelszavadat.</p>
            </div>
            <div class="col-md-7">
                <form autocomplete="off" id="reset-password-form">
                    <h2 class="login_bejel_text_cim">Új jelszó beállítása</h2><br>
                    <input type="hidden" id="token" value="<?php echo $token; ?>">
                    <div class="mb-3">
                        <input type="password" class="form-control" id="new-password" name="new-password" placeholder="Új jelszó" required>
                    </div>
                    <div class="mb-3">
                        <input type="password" class="form-control" id="confirm-password" name="confirm-password" placeholder="Jelszó megerősítése" required>
                    </div>
                    <div class="mb-3">
                        <button type="submit" class="btn btn-primary col-12">Jelszó beállítása</button><br><br>
                        <p>Sikerült?</p>
                        <a href="../../index.html"><div class="btn btn-primary col-0 offset-0">Bejelentkezés</div></a>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <!-- Üzenetdoboz az oldal alján -->
    <div id="reset-info" style="display: none;"></div>
</body>
</html>