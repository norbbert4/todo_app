<?php
switch ($entity) {
    case 'todos':
        $entityName = ['teendő', 'teendők'];
        break;
        
    case 'users':
        $entityName = ['felhasználó', 'felhasználók'];
        break;

    default:
        $entityName = ['teendő', 'teendők'];     
        break;
}
?>