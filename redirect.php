<?php
// Получаем данные от WayForPay
$merchant = $_POST['merchant'];
$amount = $_POST['amount'];
$orderReference = $_POST['orderReference'];
$orderStatus = $_POST['orderStatus'];
$signature = $_POST['signature'];

// Проверяем подпись
$private_key = 'YOUR_PRIVATE_KEY'; // Приватный ключ
$expected_signature = md5($merchant . ';' . $orderReference . ';' . $amount . ';' . $orderStatus . ';' . $private_key);

// Если подпись верна, обрабатываем платеж
if ($signature == $expected_signature) {
    if ($orderStatus == 'approved') {
        // Платеж успешен
        // Обновите статус заказа в базе данных и отправьте подтверждение пользователю
        echo "Платеж успешно завершен!";
    } else {
        // Платеж не прошел
        echo "Ошибка при оплате!";
    }
} else {
    echo "Неверная подпись!";
}
?>
