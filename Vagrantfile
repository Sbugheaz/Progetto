# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "LeonardoPuccio/Minimal-LAMP-Stack"
  config.vm.box_version = "1.0.0"

  config.vm.provision :shell, path: "scripts/bootstrap.sh"

  config.vm.network "forwarded_port", guest: 80, host: 80
  config.vm.network "forwarded_port", guest: 3306, host: 3307
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "private_network", ip: "192.168.33.10"

  config.vm.synced_folder "www/", "/var/www/html"
end
