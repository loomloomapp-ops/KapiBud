<?php
// Скопіюйте цей файл у admin.config.php та змініть параметри.
// Хеш можна згенерувати так:
//   php -r "echo password_hash('ваш-пароль', PASSWORD_BCRYPT);"

return [
    'user'      => 'primebud',
    'pass_hash' => '$2y$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    'max_image_mb' => 10,
    'max_video_mb' => 80,
];
