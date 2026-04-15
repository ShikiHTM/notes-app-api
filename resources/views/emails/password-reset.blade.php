<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu - Shikii Studio</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 h-screen flex items-center justify-center">
<div class="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
    <div class="flex justify-center mb-6">
        <svg class="w-12 h-12 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
    </div>

    <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Thiết lập mật khẩu mới</h2>

    <form action="/api/auth/reset-password" method="POST" class="space-y-4">
        <input type="hidden" name="token" value="{{ request()->token }}">
        <input type="hidden" name="email" value="{{ request()->email }}">

        <div>
            <label class="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <input type="password" name="password" required
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black">
        </div>

        <div>
            <label class="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
            <input type="password" name="password_confirmation" required
                   class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-black focus:border-black">
        </div>

        <button type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none">
            Cập nhật mật khẩu
        </button>
    </form>

    <p class="mt-4 text-xs text-center text-gray-500">
        © {{ date('Y') }} Shikii Studio. Bảo mật là ưu tiên hàng đầu.
    </p>
</div>
</body>
</html>
