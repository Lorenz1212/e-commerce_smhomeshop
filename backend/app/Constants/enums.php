<?php 
//DEFAULT VALUE
if (!defined('ENUM_YES')) define('ENUM_YES', 'Y');
if (!defined('ENUM_NO')) define('ENUM_NO', 'N');

if (!defined('MALE')) define('MALE', 'M');
if (!defined('FEMALE')) define('FEMALE', 'F');
if (!defined('OTHER_GENDER')) define('OTHER_GENDER', 'O');

if (!defined('ORDER_PENDING')) define('ORDER_PENDING', 'PENDING');
if (!defined('ORDER_RESERVED')) define('ORDER_RESERVED', 'RESERVED');
if (!defined('ORDER_PROCESSING')) define('ORDER_PROCESSING', 'PROCESSING');
if (!defined('ORDER_SHIPPED')) define('ORDER_SHIPPED', 'SHIPPED');
if (!defined('ORDER_DELIVERED')) define('ORDER_DELIVERED', 'DELIVERED');
if (!defined('ORDER_CANCELLED')) define('ORDER_CANCELLED', 'CANCELLED');
if (!defined('ORDER_RETURNED')) define('ORDER_RETURNED', 'RETURNED');

if (!defined('ORDER_ITEM_PENDING')) define('ORDER_ITEM_PENDING', 'PENDING');
if (!defined('ORDER_ITEM_FULFILLED')) define('ORDER_ITEM_FULFILLED', 'FULFILLED');
if (!defined('ORDER_ITEM_RETURNED')) define('ORDER_ITEM_RETURNED', 'RETURNED');

if (!defined('PAYMENT_STATUS_PENDING')) define('PAYMENT_STATUS_PENDING', 'PENDING');
if (!defined('PAYMENT_STATUS_PAID')) define('PAYMENT_STATUS_PAID', 'PAID');
if (!defined('PAYMENT_STATUS_FAILED')) define('PAYMENT_STATUS_FAILED', 'FAILED');
if (!defined('PAYMENT_STATUS_REFUNDED')) define('PAYMENT_STATUS_REFUNDED', 'REFUNDED');

if (!defined('PAYMENT_METHOD_COD')) define('PAYMENT_METHOD_COD', 'COD');
if (!defined('PAYMENT_METHOD_CARD')) define('PAYMENT_METHOD_CARD', 'CARD');
if (!defined('PAYMENT_METHOD_GCASH')) define('PAYMENT_METHOD_GCASH', 'GCASH');
if (!defined('PAYMENT_METHOD_CASH')) define('PAYMENT_METHOD_CASH', 'CASH');

if (!defined('POS_PENDING')) define('POS_PENDING', 'PENDING');
if (!defined('POS_IN_PROGRESS')) define('POS_IN_PROGRESS', 'IN_PROGRESS');
if (!defined('POS_PAID')) define('POS_PAID', 'PAID');
if (!defined('POS_READY')) define('POS_READY', 'READY');
if (!defined('POS_SERVED')) define('POS_SERVED', 'SERVED');
if (!defined('POS_CANCELLED')) define('POS_CANCELLED', 'CANCELLED');

if (!defined('ACTION_PENDING')) define('ACTION_PENDING', 'PENDING');
if (!defined('ACTION_PROCESSING')) define('ACTION_PROCESSING', 'IN_PROGRESS');
if (!defined('ACTION_DONE')) define('ACTION_DONE', 'DONE');

if (!defined('QUEUE_ONLINE')) define('QUEUE_ONLINE', 'ONLINE');
if (!defined('QUEUE_DIRECT')) define('QUEUE_DIRECT', 'DIRECT');

if (!defined('CART_PENDING')) define('CART_PENDING', 'PENDING');
if (!defined('CART_COMPLETED')) define('CART_COMPLETED', 'COMPLETED');

if (!defined('FEEDBACK_NEW')) define('FEEDBACK_NEW', 'NEW');
if (!defined('FEEDBACK_IN_PROGRESS')) define('FEEDBACK_IN_PROGRESS', 'IN_PROGRESS');
if (!defined('FEEDBACK_RESOLVED')) define('FEEDBACK_RESOLVED', 'RESOLVED');