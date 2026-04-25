package com.devjava.demo.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;


@RestController
public class testeController {

    @GetMapping("/")
    public String testeTestado(){
        return "teste java com spring no vscode deu bom";
    }
}
