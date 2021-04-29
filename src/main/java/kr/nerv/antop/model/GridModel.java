package kr.nerv.antop.model;

import java.util.Date;

public class GridModel {
	private Integer seq;
	private String grid;
	private Date created;
	private Date modified;
	private Date cost;

	@Override
	public String toString() {
		return "GridModel [seq=" + seq + ", grid=" + grid + ", created=" + created + ", modified=" + modified
				+ ", cost=" + cost + "]";
	}

	public Integer getSeq() {
		return seq;
	}

	public void setSeq(Integer seq) {
		this.seq = seq;
	}

	public String getGrid() {
		return grid;
	}

	public void setGrid(String grid) {
		this.grid = grid;
	}

	public Date getCreated() {
		return created;
	}

	public void setCreated(Date created) {
		this.created = created;
	}

	public Date getModified() {
		return modified;
	}

	public void setModified(Date modified) {
		this.modified = modified;
	}

	public Date getCost() {
		return cost;
	}

	public void setCost(Date cost) {
		this.cost = cost;
	}

}
