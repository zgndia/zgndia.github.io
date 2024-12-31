<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Milli Eğitim Bakanlığı</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');

        body {
            background-color: #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center; /* Tam ortaya alır */
            align-items: left;
            height: 100vh;
            margin: 0;
            font-family: 'Montserrat', Arial, sans-serif; /* Yeni font */
            color: white;
        }
        .exclamation {
            position: absolute;
            top: 100px; /* Sayfanın üstünden uzaklık */
            left: 200px; /* Sayfanın solundan uzaklık */
            margin: 0;
        }
        .exclamation img {
            width: 300px; /* Görsel boyutunu küçült */
            height: auto;
        }
        .error-message {
            font-size: 48px; /* Yazıyı büyütür */
            margin: 20px 0;
            padding-left: 250px;
            color: #000000;
        }
        .sub-message {
            font-size: 24px; /* Alt başlık yazı boyutu */
            padding-bottom: 100px;
            padding-left: 250px;
            margin: 10px 0;
            color: #555555; /* Daha açık bir renk */
        }
    </style>
</head>
<body>
    <div class="exclamation">
        <img src="meb.png" alt="Exclamation Mark">
    </div>
    <div class="error-message">Web Sayfası Engellenmiştir!</div>
    <div class="sub-message">Erişmeye çalıştığınız sayfa MEB erişim politikası gereğince engellenmiştir.</div>

    <script>
        function closeTab() {
            window.close();
        }
    </script>
</body>
</html>
