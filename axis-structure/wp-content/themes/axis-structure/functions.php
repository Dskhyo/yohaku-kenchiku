<?php
/** AXIS STRUCTURE: phase 1–3 theme foundation. */
if (!defined('ABSPATH')) { exit; }
function axis_structure_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array('search-form','comment-form','comment-list','gallery','caption','style','script'));
    add_theme_support('editor-styles');
    add_editor_style('assets/css/editor.css');
    register_nav_menus(array('primary' => __('Main navigation', 'axis-structure'), 'footer' => __('Footer navigation', 'axis-structure')));
}
add_action('after_setup_theme', 'axis_structure_setup');
function axis_structure_assets() {
    $uri = get_template_directory_uri();
    wp_enqueue_style('axis-structure', $uri . '/assets/css/main.css', array(), '0.1.0');
    wp_enqueue_script('axis-main', $uri . '/assets/js/main.js', array(), '0.1.0', true);
    if (is_front_page()) {
        wp_enqueue_style('axis-motion', $uri . '/assets/css/motion.css', array('axis-structure'), '0.2.0');
        wp_enqueue_script('axis-intro-boot', $uri . '/assets/js/intro-boot.js', array(), '0.2.0', false);
        wp_enqueue_script('axis-gsap', $uri . '/assets/js/vendor/gsap.min.js', array(), '3.13.0', true);
        wp_enqueue_script('axis-scroll-trigger', $uri . '/assets/js/vendor/ScrollTrigger.min.js', array('axis-gsap'), '3.13.0', true);
        $previous = 'axis-scroll-trigger';
        foreach (array('animation-utils','loader','hero','technology','scroll','cursor','motion') as $module) {
            wp_enqueue_script('axis-' . $module, $uri . '/assets/js/' . $module . '.js', array($previous), '0.2.0', true);
            $previous = 'axis-' . $module;
        }
    }
}
add_action('wp_enqueue_scripts', 'axis_structure_assets');
