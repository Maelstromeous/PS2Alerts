<?php

use League\Container\Container;
use League\Container\ContainerInterface;
use League\Route\RouteCollection;

// Load the route collection. If container is not ready, generate one here now.
$route = new RouteCollection(
    isset($container) && $container instanceof ContainerInterface ? $container : new Container
);

$route->get('/', 'Ps2alerts\Frontend\Controller\MainController::landing');
$route->get('/about', 'Ps2alerts\Frontend\Controller\MainController::about');
$route->get('/alert-history', 'Ps2alerts\Frontend\Controller\MainController::alertHistory');
$route->get('/alert/{id:number}', 'Ps2alerts\Frontend\Controller\MainController::alert');

return $route;
