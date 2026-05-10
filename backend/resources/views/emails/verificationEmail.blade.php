<x-mail::message>
# Kích hoạt tài khoản

Chào bạn,

Để có thể sử dụng ứng dụng của chúng tôi trọn vẹn nhất, bạn có thể kích hoạt tài khoản của bạn bằng cách nhấn vào nút bên dưới

<x-mail::button :url="$url">
    Kích Hoạt
</x-mail::button>

Cảm ơn bạn đã sử dụng ứng dụng của chúng tôi.

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
