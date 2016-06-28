var gulp         = require("gulp"), //Подключаем Gulp
    sass         = require('gulp-sass'), //Подключаем Sass пакет,
    browserSync  = require('browser-sync'), // Подключаем Browser Sync
    concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
    uglify       = require('gulp-uglify'), // Подключаем gulp-uglifyjs (для сжатия JS)
    cssnano      = require('gulp-cssnano'), // Подключаем пакет для минификации CSS
    imagemin     = require('gulp-imagemin'), // Подключаем библиотеку для работы с изображениями
    pngquant     = require('imagemin-pngquant'), // Подключаем библиотеку для работы с png
    autoprefixer = require('gulp-autoprefixer'); // Подключаем библиотеку для добавления вендорных префиксов

var vendorJs = [ // Берем все необходимые библиотеки
  'libs/jquery/jquery-3.0.0.min.js',
  'libs/jqueryMigrate/jquery-migrate-1.4.1.min.js',
  'libs/slick/slick.min.js'
];

var vendorCss = [ // Берем все необходимые библиотеки
  'libs/fontAwesome/font-awesome.min.css',
  'libs/slick/slick.css'
];

gulp.task('browserSync', function() {  // Создаем таск browser-sync
    browserSync.init({ // Выполняем browserSync
        server: { // Определяем параметры сервера
            baseDir: "." // Директория для сервера
        },
	      notify: false // Отключаем уведомления
    });
});

gulp.task('sass', function(){ // Создаем таск Sass
	return gulp.src('sass/**/*.scss') // Берем источник
		.pipe(sass({outputStyle: 'expanded'})) // Преобразуем Sass в CSS посредством gulp-sass
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) // Создаем префиксы
		.pipe(gulp.dest('css')) // Выгружаем результата в папку css
    .pipe(browserSync.stream()) // Обновляем CSS на странице при изменении
});

gulp.task('vendorJs', function() {
	return gulp.src(vendorJs)
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('js')); // Выгружаем в папку js
});

gulp.task('cssLibs', ['sass'], function() {
	return gulp.src(vendorCss) // Выбираем файл для минификации
    .pipe(concat('libs.min.css')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(cssnano()) // Сжимаем
		.pipe(gulp.dest('css')); // Выгружаем в папку css
});

gulp.task('img', function() {
	return gulp.src('img/**/*.*') // Берем все изображения из
		.pipe(imagemin({  // Сжимаем их с наилучшими настройками с учетом кеширования
			interlaced: true,
			progressive: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest('img/')); // Выгружаем на продакшен
});

gulp.task('watch', ['browserSync', 'cssLibs', 'vendorJs', 'img'], function() {
	gulp.watch('sass/**/*.scss', ['sass']); // Наблюдение за sass файлами в папке sass
	gulp.watch('./*.html', browserSync.reload); // Наблюдение за HTML файлами в корне проекта
	gulp.watch('js/**/*.js', browserSync.reload);   // Наблюдение за JS файлами в папке js
});

gulp.task('default', ['watch']);
