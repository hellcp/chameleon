$(".box").each(function() {
	var $this = $(this);
	$this.removeClass("box box-shadow infobox").addClass("card");

	// Margin for float card
	if ($this.css("float") === "right") {
		$this.addClass("ml-3");
	} else if ($this.css("float") === "left") {
		$this.addClass("mr-3");
	}

	// Wrap all content with a "card-body" block
	var $body = $('<div class="card-body">' + $this.html() + "</div>");
	$this.html("");
	$this.append($body);

	// Set card image
	var $img = $this.find("img").first();
	if ($img.width() >= 100) {
		$img.addClass("card-img-top").appendTo($this);
	}

	// Set card title
	var $header = $this.find(".box-header");
	var title = $header.html();
	$header.remove();
	$body.prepend('<h4 class="card-title">' + title + "</h4>");

	// Remove empty <p> tag
	$body.find("p").each(function() {
		if ($this.find("img").length || $this.text().trim()) return;
		$this.remove();
	});
});
