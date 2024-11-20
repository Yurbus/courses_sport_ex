<?php
// Ваши ключи
$public_key = 'YOUR_PUBLIC_KEY'; // Публичный ключ
$private_key = 'YOUR_PRIVATE_KEY'; // Приватный ключ

// Параметры платежа
$amount = 594; // Сумма в гривнах (UAH)
$currency = 'UAH'; // Валюта
$order_id = uniqid('order_'); // Уникальный идентификатор заказа
$redirect_url = 'URL_на_который_нужно_перенаправить_пользователя_после_оплаты';
$callback_url = 'URL_для_обработки_ответа_от_WayForPay'; // URL, на который приходит ответ от WayForPay

// Данные для оплаты
$params = [
    'merchant' => $public_key,
    'amount' => $amount,
    'currency' => $currency,
    'orderReference' => $order_id,
    'orderDate' => time(),
    'productName' => '10-ти денний марафон',
    'productPrice' => $amount,
    'productCount' => 1,
    'redirectUrl' => $redirect_url,
    'serviceUrl' => $callback_url
];

// Создаем подпись для запроса
$signature = md5(implode(';', $params) . ';' . $private_key);

// Добавляем подпись в параметры
$params['signature'] = $signature;

// Отправляем запрос на WayForPay API
$url = 'https://api.wayforpay.com/api/merchant/invoice';
$options = [
    'http' => [
        'method' => 'POST',
        'header' => "Content-Type: application/x-www-form-urlencoded",
        'content' => http_build_query($params)
    ]
];
$context = stream_context_create($options);
$response = file_get_contents($url, false, $context);

// Преобразуем ответ в массив
$response_data = json_decode($response, true);

// Если всё прошло успешно, получаем ссылку для оплаты
if ($response_data['status'] == 'success') {
    header("Location: " . $response_data['url']);
    exit();
} else {
    echo "Ошибка при создании платежа";
}
?>
