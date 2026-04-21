<x-mail::message>
# Đặt lại mật khẩu

Chào bạn,

Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, bạn có thể bỏ qua email này một cách an toàn.

<x-mail::button :url="$url">
    Đặt lại mật khẩu
</x-mail::button>

**Lưu ý:** Liên kết này sẽ hết hạn sau 60 phút để đảm bảo an toàn cho tài khoản của bạn.

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
