FROM php:8.4-apache

# 必要なパッケージとPHP拡張機能をインストール
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libpq-dev \
    zip \
    unzip \
    git \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo pdo_pgsql gd

# Composerをインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 作業ディレクトリを設定
WORKDIR /var/www/html

# プロジェクトのファイルをコピー
COPY . .

# 依存関係をインストール
RUN composer install --no-dev --optimize-autoloader

# Apacheのドキュメントルートを public に変更
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf

# ★ここを追加：.htaccessの読み込みを許可する★
RUN sed -i 's/AllowOverride None/AllowOverride All/g' /etc/apache2/apache2.conf

# ★ここを追加：Laravelのルーティングを有効にする★
RUN a2enmod rewrite

# 権限を設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Apacheをフォアグラウンドで起動
CMD ["apache2-foreground"]